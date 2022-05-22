import * as THREE from "three";

export interface IBubble {
    msg: String;
    color: String;
    ctx: CanvasRenderingContext2D;
    plane: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
    posX: number;
    posY: number;
    posZ: number;
    rotY: number;
  }

export class Bubble implements IBubble {
    constructor(init?: Partial<Bubble>) {
      Object.assign(this, init);
      this.ctx = document.createElement("canvas").getContext("2d");
    }

    msg: String;
    color: String;
    ctx: CanvasRenderingContext2D;
    plane: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
    posX: number;
    posY: number;
    posZ: number;
    rotY: number;

    createBubble(color, msg, ctx) {
      function drawBubble(color) {
        ctx.canvas.width = 256;
        ctx.canvas.height = 256;
        ctx.clearRect(0, 0, 256, 256);
        ctx.beginPath();
        ctx.moveTo(75 * 2, 25);
        // 吹き出し左上
        ctx.quadraticCurveTo(25, 25, 25, 62.5 * 2);
        // 吹き出し左下
        ctx.quadraticCurveTo(25, 100 * 2, 50 * 2, 100 * 2);
        // 吹き出し右下
        ctx.quadraticCurveTo(125 * 2, 100 * 2, 125 * 2, 62.5 * 2);
        // 吹き出し右上
        ctx.quadraticCurveTo(125 * 2, 25, 75 * 2, 25);
        // 吹き出し下
        ctx.quadraticCurveTo(50 * 2, 120 * 2, 30 * 2, 125 * 2);
        ctx.quadraticCurveTo(60 * 2, 120 * 2, 65 * 2, 100 * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      function drawMsg(msg) {
        ctx.fillStyle = "black";
        ctx.font = "20px 'Arial'";
        ctx.textAlign = "center";
        ctx.fillText(msg, ctx.canvas.width / 2, ctx.canvas.height / 2);
      }

      drawBubble(color);
      drawMsg(msg);
      this.ctx = ctx;
    }

    createPlane(ctx) {
      const planeGeometry = new THREE.PlaneGeometry(5, 5);
      const planeTexture = new THREE.CanvasTexture(ctx.canvas);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: planeTexture,
        transparent: true,
        emissive: 0xc2c2c2,
        emissiveIntensity: 0.6,
        flatShading: true,
        side: THREE.DoubleSide,
      });
      this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
    }
  }
