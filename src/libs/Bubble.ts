import * as THREE from "three";

export interface IBubble {
    uuid: string | undefined;
    msg: string | undefined;
    color: string | undefined;
    ctx: CanvasRenderingContext2D | null;
    plane: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial> | undefined;
    posX: number | undefined;
    posY: number | undefined;
    posZ: number | undefined;
    rotY: number | undefined;
  }

export class Bubble implements IBubble {
    uuid: string = "";
    msg: string = "";
    color: string = "white";
    ctx: CanvasRenderingContext2D | null = document.createElement("canvas").getContext("2d");
    plane: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial> | undefined;
    posX: number = 0;
    posY: number = 0;
    posZ: number = 0;
    rotY: number = 0;

    constructor(init?: Partial<Bubble>) {
      Object.assign(this, init);
      this.plane = this.createPlane(this.ctx);
      this.uuid = this.plane.uuid;
      this.plane.position.set(this.posX, this.posY, this.posZ);
      this.plane.rotation.y = this.rotY;
    }

    createBubble(color: string, msg: string, ctx: CanvasRenderingContext2D): void {
      function drawBubble(color: string): void {
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

      function drawMsg(msg: string): void {
        ctx.fillStyle = "black";
        ctx.font = "20px 'Arial'";
        ctx.textAlign = "center";
        ctx.fillText(msg, ctx.canvas.width / 2, ctx.canvas.height / 2);
      }

      drawBubble(color);
      drawMsg(msg);
      this.ctx = ctx;
    }

    createPlane(ctx: CanvasRenderingContext2D) :THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial> {
      let planeGeometry = new THREE.PlaneGeometry(5, 5);
      let planeTexture = new THREE.CanvasTexture(ctx.canvas);
      let planeMaterial = new THREE.MeshStandardMaterial({
        map: planeTexture,
        transparent: true,
        emissive: 0xc2c2c2,
        emissiveIntensity: 0.6,
        flatShading: true,
        side: THREE.DoubleSide,
      });
      let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
      planeMesh.name = "bubble";
      return planeMesh;
    }
  }
