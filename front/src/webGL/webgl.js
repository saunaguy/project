import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Edukit from "./loader";
import GUI from "lil-gui";
import "../css/gui.css";
import "../css/dash.css";

function WebGL() {
  useEffect(() => {
    const ws = new WebSocket("ws://192.168.0.124:8081");

    ws.addEventListener("open", () => {
      console.log("WebSocket connection.");
    });

    ws.addEventListener("message", (event) => {
      const receivedMessage = JSON.parse(event.data);

      if (receivedMessage.Wrapper) {
        const tag3 = receivedMessage.Wrapper.find((item) => item.tagId === "3");
        const tag4 = receivedMessage.Wrapper.find((item) => item.tagId === "4");
        const tag21 = receivedMessage.Wrapper.find(
          (item) => item.tagId === "21"
        );

        myObject.NO1 = tag3 && tag3.value ? "#00FF00" : "#FF0000";
        myObject.NO2 = tag4 && tag4.value ? "#00FF00" : "#FF0000";
        myObject.NO3 = tag21 && tag21.value >= 1 ? "#00FF00" : "#FF0000";

        no1.setValue(myObject.NO1);
        no2.setValue(myObject.NO2);
        no3.setValue(myObject.NO3);
      }
    });

    const canvas = document.querySelector("#webgl");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      (window.innerWidth * 0.45) / (window.innerHeight * 0.85),
      0.1,
      1000
    );
    const edukit = new Edukit();
    edukit.fileload(scene);

    camera.position.set(50, 50, 70);
    scene.add(camera);

    const guiContainer = document.createElement("div");
    guiContainer.classList.add("gui-container");
    document.body.appendChild(guiContainer);

    const gui = new GUI({ autoPlace: false });
    guiContainer.appendChild(gui.domElement);

    const myObject = {
      start: function () {
        const data = JSON.stringify({ tagId: "1", value: "1" });
        ws.send(data);
      },
      stop: function () {
        const data = JSON.stringify({ tagId: "1", value: "0" });
        ws.send(data);
      },
      NO1: "#FF0000",
      NO2: "#FF0000",
      NO3: "#FF0000",
      reset: function () {
        const data = JSON.stringify({ tagId: "8", value: "1" });
        ws.send(data);
      },
    };

    gui.add(myObject, "start");
    gui.add(myObject, "stop");

    const no1 = gui.addColor(myObject, "NO1");
    const no2 = gui.addColor(myObject, "NO2");
    const no3 = gui.addColor(myObject, "NO3");
    gui.add(myObject, "reset");

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth * 0.45, window.innerHeight * 0.85);
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x1c2631);

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    scene.add(directionalLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    new OrbitControls(camera, renderer.domElement);

    let requestId = null;
    const tick = () => {
      renderer.render(scene, camera);
      requestId = requestAnimationFrame(tick);
      camera.updateMatrixWorld();
      camera.updateProjectionMatrix();
    };

    tick();

    return () => {
      cancelAnimationFrame(requestId);
      ws.close();
      guiContainer.remove();
    };
  }, []);

  return (
    <div>
      <canvas id="webgl" style={{ borderRadius: "30px" }}></canvas>
    </div>
  );
}

export default WebGL;
