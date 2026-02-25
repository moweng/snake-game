// 渲染相关的函数
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = 20;
    }

    clearCanvas() {
        this.ctx.fillStyle = '#f8f9fa';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid(gameWidth, gameHeight) {
        this.ctx.strokeStyle = '#e9ecef';
        this.ctx.lineWidth = 0.5;

        // 绘制垂直线
        for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // 绘制水平线
        for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawSnake(snake, direction) {
        snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#28a745' : '#2ecc71'; // 头部更暗一些
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );

            // 绘制蛇的眼睛（仅头部）
            if (index === 0) {
                this.ctx.fillStyle = '#000';
                // 根据方向绘制眼睛位置
                let eyeX, eyeY, eyeSize = 3;

                if (direction.x === 1) { // 右
                    eyeX = segment.x * this.gridSize + this.gridSize - 6;
                    eyeY = segment.y * this.gridSize + 5;
                } else if (direction.x === -1) { // 左
                    eyeX = segment.x * this.gridSize + 3;
                    eyeY = segment.y * this.gridSize + 5;
                } else if (direction.y === 1) { // 下
                    eyeX = segment.x * this.gridSize + 5;
                    eyeY = segment.y * this.gridSize + this.gridSize - 6;
                } else { // 上
                    eyeX = segment.x * this.gridSize + 5;
                    eyeY = segment.y * this.gridSize + 3;
                }

                this.ctx.fillRect(eyeX, eyeY, eyeSize, eyeSize);
            }
        });
    }

    drawFood(food) {
        this.ctx.fillStyle = '#dc3545';
        this.ctx.beginPath();
        this.ctx.arc(
            food.x * this.gridSize + this.gridSize / 2,
            food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 1,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    renderGame(snake, food, direction, gameWidth, gameHeight) {
        this.clearCanvas();
        this.drawGrid(gameWidth, gameHeight);
        this.drawSnake(snake, direction);
        this.drawFood(food);
    }
}

// 导出渲染器类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Renderer;
}