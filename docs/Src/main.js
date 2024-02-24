const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");//2次元描画
var img = new Image();
img.onload = function() {
        ctx.drawImage(img, 0, 0, 3200, 3200);
    };
img.src = 'Src/sea.jpg'; 
console.log("check")

window.onload = function() {
    const x = canvas.width;
    const y = canvas.height;
    const N = 100;
    const size = 5;
    const w1 = 1;
    const w2 = 1;
    const w3 = 1;
    const dt = 0.01;
    const c = 0;//閾値
    const r = size;//判定半径
    let pos_X = Array(N);
    let pos_Y = Array(N);
    let vel_X = Array(N);
    let vel_Y = Array(N);
    let pos_X1 = Array(N);
    let pos_Y1 = Array(N);
    let vel_X1 = Array(N);
    let vel_Y1 = Array(N);
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
          //ctx.strokeRect(0,0,x,y);//キャンバスを示す
        for (let i = 0; i < N; i++){
            ctx.strokeRect(pos_X1[i],pos_Y1[i],size,size);//各座標に描画
        }
        //↑初期化
        function translate() {
            step ++;
            if(step%1000 == 0){
                for (let i = 0; i < N; i++){
                    vel_X[i] = -vel_X[i];
                    vel_Y[i] = -vel_Y[i];
                    vel_X1[i] = -vel_X1[i];
                    vel_Y1[i] = -vel_Y1[i];
                }
            }
            if(step%1000 == 333){
                for (let i = 0; i < N; i++){
                    vel_X[i] = -vel_Y[i];
                    vel_Y[i] = vel_X[i];
                    vel_X1[i] = -vel_Y1[i];
                    vel_Y1[i] = vel_X[i];
                }
            }
            if(step%1000 == 667){
                for (let i = 0; i < N; i++){
                    vel_X[i] = vel_Y[i];
                    vel_Y[i] = -vel_X[i];
                    vel_X1[i] = vel_Y1[i];
                    vel_Y1[i] = -vel_X1[i];
                }
            }
            for (let i = 0; i < N; i++){
                if(pos_X1[i] <= 0 && vel_X1[i] <= 0){
                    pos_X1[i] += x;
                }
                if(pos_X1[i] + size >= x && vel_X1[i] >= 0){
                    pos_X1[i] -= x;
                }
                if(pos_Y1[i] <= 0 && vel_Y1[i] <= 0){
                    pos_Y1[i] += y;
                }
                if(pos_Y1[i] + size >= y && vel_Y1[i] >= 0){
                    pos_Y1[i] -= y;
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
                pos_X1[i] += vel_X1[i]*dt;
                pos_Y1[i] += vel_Y1[i]*dt;    
            }
            ctx.clearRect(0,0,canvas.width, canvas.height);//リセット
            ctx.beginPath();
            // ctx.fillStyle = "black";
            // ctx.font = "20px sans-serif";
            // ctx.fillText("step:" + step, 0, 40);
            // ctx.strokeRect(0,0,x,y);//輪郭線の四角形
            ctx.drawImage(img, 0, 0, x, y);
            for (let i = 0; i < N; i++){
                ctx.strokeRect(pos_X1[i],pos_Y1[i],size,size);//各座標に描画
            }
            for (let i = 0; i < N; i++){
                pos_X[i] = pos_X1[i];
                pos_Y[i] = pos_Y1[i];
                vel_X[i] = vel_X1[i];
                vel_Y[i] = vel_Y1[i];
                }
            requestAnimationFrame(translate);//繰り返し呼び出す
          }
          
        translate();
          
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
