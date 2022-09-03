import "./App.css";
import "./style.css";
import Transaction from "./chain/Transaction";
import BlockChain from "./chain/BlockChain";
import React, { useState, useEffect,useRef } from "react";
import { io } from "socket.io-client";
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

function App() {
  const publicKeys = {
    "04095ca26ae88095352f347ae79a84ab232ae08efedc56978dc0df6e00ef1f86adc423f19b0b80921ba04b2c08b0789c52e50d90d1d93d7e29f80c903a79f11cb3":
      "ziya",
    "0423d6c72695042102ca5b9490968786d3d439e87f056915d87b1c9bbb0ef4b108490db85053eb71081a13afe7d297004642d2bc2830a4269682ba8fe19f8ccd86":
      "baran",
    "04fbf87e3de7d50670a1b0ffcd83b3bd1666fa0a4fc0a290fb0643658eec8b31dfd5a0aa26b3fb5aa119ec62c61e54c589c0e9107124eb6a84948ff2d4b8e577a6":
      "ozcan",
  };
  const [belgeTuru, setBelgeTuru] = useState("");
  const [kisi, setKisi] = useState("");
  const [fileName, setFileName] = useState("");
  const [res, setRes] = useState("");
  const [notify, setNotify] = useState(false);
  const [code, setCode] = useState("");   // kisinin public keyi
  const [belge, setBelge] = useState([]);

  const opt1 = useRef(null);
  const opt2 = useRef(null);
  const file = useRef(null);
  const key = useRef(null);
  const socket = useRef(null);
  const blockChain = useRef(null);

  const send = (e) => {
    e.preventDefault();
    if (fileName === "" || belgeTuru === "" || kisi === "") {
      return;
    }
    let reader = new FileReader();
    reader.onload = function (e) {
      setRes(e.target.result);
    };
    reader.readAsDataURL(fileName);
  };


  useEffect(() => {

    if (res !== "") {
      console.log("trans blogu");
      let timer = new Date();
      let tx1 = new Transaction(
        key.current.getPublic("hex"),
        [Object.keys(publicKeys).find((key) => publicKeys[key] === kisi)],
        {
          data: res,
          fName: fileName.name,
        }
      );

      tx1.signTransaction(key.current);
      blockChain.current.addTransaction(tx1);
      blockChain.current.minePendingTransactions();
      socket.current.emit(
        "get-chain",
        JSON.stringify(blockChain.current.chain)
      );
      opt1.current.selected = "select";
      opt2.current.selected = "select";
      file.current.value = "";
      setRes("");
      setNotify(true);
      setTimeout(() => setNotify(false), 4000);
      console.log("trans blogu sonu : ", (new Date() - timer) / 1000);
    }
  }, [res]);


  useEffect(() => {    // kod atamasi
    let res = prompt("kisi kodu girin");
    if (res !== null && res !== "") {
      setCode(res);
    }
  }, []);


  useEffect(() => {
    if (!code) return;
    console.log("socket.current :",socket.current);
    socket.current = io("http://localhost:5000/", {
      transports: ["websocket", "polling", "flashsocket"],
    });
    blockChain.current = new BlockChain("null");
    console.log("socket.current :",socket.current.blockChain);
    key.current = ec.keyFromPrivate(
      code + "6abc91f1cd74bcfccc5b0508f6d7e019d114e2e99139a2d11ff362cd6ffc82c"
    );
    console.log("code : ", code);
    console.log("key : ", key.current.getPublic("hex"));
    socket.current.on("request-chain", (chain) => {
      console.log("request blogu");
      let timer = new Date();
      console.log("blockchain :", blockChain.current.chain);
      blockChain.current.chain = JSON.parse(chain);
      console.log("block Chain : ", JSON.parse(chain));
      let tempArray = blockChain.current.chain.filter((el) => {
        return (
          el.transactions[0]?.receivers[0] === key.current.getPublic("hex")
        );
      });
      setBelge(tempArray);
      console.log("request blogu zamani : ", (new Date() - timer) / 1000);
    });

    socket.current.on("send-chain", (chain) => {
      console.log("send blogu");
      let timer = new Date();
      blockChain.current.chain = JSON.parse(chain);
      console.log("x",JSON.parse(chain));
      let tempArray = blockChain.current.chain.filter((el) => {
        console.log();
        return (
          el.transactions[0]?.receivers[0] === key.current.getPublic("hex")
        );
      });
      setBelge(tempArray);
      console.log("send blogu zamani : ", (new Date() - timer) / 1000);
    });

  }, [code]);

  return (
    <div className="App">
      <div className="container">
        <form className="form-inline">
          <label htmlFor="paper-type">Belge Türü</label>
          <select
            defaultValue={"default"}
            onChange={(e) => setBelgeTuru(e.target.value)}
            name="paper-type"
            id="paper-type"
          >
            <option ref={opt1} value="default" disabled hidden>
              Belge Türü Seçiniz...
            </option>
            <option value="obelgesi">Öğrenci Belgesi</option>
            <option value="transkript">Transkript</option>
          </select>

          <label htmlFor="kisi">Gönderilecek Kişi</label>
          <select
            defaultValue={"default"}
            onChange={(e) => setKisi(e.target.value)}
            name="kisi"
            id="kisi"
          >
            <option ref={opt2} value="default" disabled hidden>
              Kişi Seçiniz...
            </option>
            {Object.keys(publicKeys).map((el) => {
              if (el !== key?.current?.getPublic("hex")) {
                //console.log("Current : ",key.current.getPublic("hex"));
                return (
                  <option key={el} value={publicKeys[el]}>
                    {
                      { baran: "Baran", ozcan: "Özcan", ziya: "Ziya" }[
                        publicKeys[el]
                      ]
                    }
                  </option>
                );
              }
            })}
          </select>

          <label htmlFor="belge-yukleme">Belge Yükle:</label>
          <input
            ref={file}
            onChange={(e) => setFileName(e.target.files[0])}
            type="file"
            name="belge-yukleme"
            accept=".pdf"
            id="belge-yukleme"
          />

          <button onClick={send} type="submit">
            Gönder
          </button>
          {notify && (
            <div id="notify">{`${fileName.name} adlı dosya ${kisi} adlı kişiye gönderildi!`}</div>
          )}
        </form>

        <div className="right">
          {belge.map((eleman, index) => {
            return (
              <div key={index} className="def">
                <a
                  href={eleman.transactions[0].data.data}
                  target="_self"
                  download={eleman.transactions[0].data.fName + ".pdf"}
                >
                  <p>{eleman.transactions[0].data.fName}</p>
                </a>
                <p>{publicKeys[eleman.transactions[0].sender]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
