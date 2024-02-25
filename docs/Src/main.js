const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");//2次元描画
var img = new Image();
img.src = 'Src/sea.jpg'; 
var img2 = new Image();
img2.src = 'Src/fish.png'; 

window.onload = function() {
    const x = canvas.width;
    const y = canvas.height;
    const N = 200;
    const size = 50;
    const w1 = 2;
    const w2 = 2;
    const w3 = 2;
    const dt = 0.005;
    const c = -0.75;//閾値
    const r = size;//判定半径
    let pos_X = Array(N);
    let pos_Y = Array(N);
    let vel_X = Array(N);
    let vel_Y = Array(N);
    let pos_X1 = Array(N);
    let pos_Y1 = Array(N);
    let vel_X1 = Array(N);
    let vel_Y1 = Array(N);
    let theta = Array(N);
    let step = 0;
    //↑定数と変数の定義
    if (canvas.getContext) {
        for (let i = 0; i < N; i++){
            var randomX = Math.random();
            var randomY = Math.random();
            X_i = Math.floor(randomX*x);
            Y_i = Math.floor(randomY*y);
            pos_X[i] = X_i;
            pos_Y[i] = Y_i;
            var vel_X_i = Math.random();
            var vel_Y_i = Math.random();
            vel_X[i] = 500*(vel_X_i - 0.5);
            vel_Y[i] = 500*(vel_Y_i - 0.5);
          }//初期位置と初期速度の定義
          for (let i = 0; i < N; i++){
            pos_X1[i] = pos_X[i];
            pos_Y1[i] = pos_Y[i];
            vel_X1[i] = vel_X[i];
            vel_Y1[i] = vel_Y[i];
            }
        //↑初期化
        function translate() {
            step ++;
            for (let i = 0; i < N; i++){
                if(pos_X1[i] + size<= 0 && vel_X1[i] <= 0){
                    pos_X1[i] += x + 2*size;
                }
                if(pos_X1[i] >= x + size && vel_X1[i] >= 0){
                    pos_X1[i] -= x + 2*size;
                }
                if(pos_Y1[i] + size <= 0 && vel_Y1[i] <= 0){
                    pos_Y1[i] += y + 2*size;
                }
                if(pos_Y1[i]  >= y + size && vel_Y1[i] >= 0){
                    pos_Y1[i] -= y + 2*size;
                }

                vel0 = w1*cohesion(i)[0] + w2*separation(i)[0] + w3*alignment(i)[0]; 
                vel1 = w1*cohesion(i)[1] + w2*separation(i)[1] + w3*alignment(i)[1];
                let rand = 0;
                rand = 2*Math.random() -1;
                if(rand > c){
                    vel0 = 1000*(Math.random()-0.5);
                    vel1 = 1000*(Math.random()-0.5);
                }
                vel_X1[i] += vel0*dt;
                vel_Y1[i] += vel1*dt;
                theta[i] = getTheta(vel_X1[i], vel_Y1[i]);
                pos_X1[i] += vel_X1[i]*dt;
                pos_Y1[i] += vel_Y1[i]*dt;    
            }
            ctx.drawImage(img, 0, 0, x, y);
            ctx.fillStyle = "black";
            ctx.font = "20px sans-serif";
            for (let i = 0; i < N; i++){
                ctx.save();
                ctx.translate(pos_X1[i], pos_Y1[i]);
                ctx.rotate(theta[i] - 0.5*Math.PI);
                console.log(theta[i]);
                ctx.drawImage(img2,-size/2,-size/2,size,size);
                ctx.restore();
            }
            ctx.fillText("Hello Aquarium!!", 0, 40);
            ctx.fillText("illustration:Reika Sano", x - 250, y - 40);
            for (let i = 0; i < N; i++){
                pos_X[i] = pos_X1[i];
                pos_Y[i] = pos_Y1[i];
                vel_X[i] = vel_X1[i];
                vel_Y[i] = vel_Y1[i];
                }
            requestAnimationFrame(translate);//繰り返し呼び出す
          }
          
        translate();
        function getTheta(vx,vy){
            let cos = 0;
            let theta = 0;
            if(vx**2 + vy**2 == 0){
                theta = 0;
            }else{
                cos = vx / Math.sqrt(vx**2 + vy**2)
            }
            if(vy >= 0){
                theta = Math.acos(cos); 
            }else{
                theta = -Math.acos(cos);
            }
            return theta;
        }

        function cohesion(j){
            let acc1 = Array(2);
            acc1[0] = 0;
            acc1[1] = 0;
            let num = 0;
            for (let i = 0; i < N; i++){
                if((pos_X[j]-pos_X[i])**2 + (pos_Y[j]-pos_Y[i])**2 < r**2 && i != j){//距離判定
                    num ++;
                    acc1[0] += pos_X[i];
                    acc1[1] += pos_Y[i];
                }
            }
            if(num != 0){
                acc1[0] /= num;
                acc1[1] /= num;
            }
            acc1[0] -= pos_X[j];
            acc1[1] -= pos_Y[j];
            return acc1;
        }

        function separation(j){
                let acc2 = Array(2);
                acc2[0] = 0;
                acc2[1] = 0;
                let num = 0;
                for (let i = 0; i < N; i++){
                    if((pos_X[j]-pos_X[i])**2 + (pos_Y[j]-pos_Y[i])**2 < r**2 && i != j){//距離判定
                        num ++;
                        acc2[0] += (pos_X[j] - pos_X[i])/((pos_X[j]-pos_X[i])**2 + (pos_Y[j]-pos_Y[i])**2 + 1);
                        acc2[1] += (pos_Y[j] - pos_Y[i])/((pos_X[j]-pos_X[i])**2 + (pos_Y[j]-pos_Y[i])**2 + 1);
                    }
                }
                if(num != 0){
                    acc2[0] /= num;
                    acc2[1] /= num;
                }
                return acc2;
        }

        function alignment(j){
            let acc3 = Array(2);
            acc3[0] = 0;
            acc3[1] = 0;
            let num =0;
            for (let i = 0; i < N; i++){
                if((pos_X[j]-pos_X[i])**2 + (pos_Y[j]-pos_Y[i])**2 < r**2 && i != j){//距離判定
                    num ++;
                    acc3[0] += vel_X[i];
                    acc3[1] += vel_Y[i];
                }
            }
            if(num != 0){
                acc3[0] /= num;
                acc3[1] /= num;
            }
            acc3[0] -= vel_X[j];
            acc3[1] -= vel_Y[j];
            return acc3;
        }
    }
}