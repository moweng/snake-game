// 工具函数模块
class GameUtils {
    // 保存最高分到本地存储
    static saveHighScore(score) {
        localStorage.setItem('snakeHighScore', score.toString());
    }

    // 从本地存储加载最高分
    static loadHighScore() {
        const saved = localStorage.getItem('snakeHighScore');
        return saved ? parseInt(saved) : 0;
    }

    // 生成不与蛇身重叠的食物位置
    static generateFoodPosition(snake, gameWidth, gameHeight) {
        let newFood;
        let overlapping;

        do {
            overlapping = false;
            newFood = {
                x: Math.floor(Math.random() * gameWidth),
                y: Math.floor(Math.random() * gameHeight)
            };

            // 检查是否与蛇身重叠
            for (const segment of snake) {
                if (segment.x === newFood.x && segment.y === newFood.y) {
                    overlapping = true;
                    break;
                }
            }
        } while (overlapping);

        return newFood;
    }

    // 检查边界碰撞
    static checkBoundaryCollision(position, gameWidth, gameHeight) {
        return (
            position.x < 0 ||
            position.x >= gameWidth ||
            position.y < 0 ||
            position.y >= gameHeight
        );
    }

    // 检查蛇与自身的碰撞
    static checkSelfCollision(position, snake) {
        // 跳过头部，因为总是与自己重合
        for (let i = 1; i < snake.length; i++) {
            if (position.x === snake[i].x && position.y === snake[i].y) {
                return true;
            }
        }
        return false;
    }

    // 验证方向变化是否有效（防止180度转弯）
    static isValidDirectionChange(currentDirection, newDirection) {
        return !(currentDirection.x === -newDirection.x && currentDirection.y === -newDirection.y);
    }
}

// 导出工具类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameUtils;
}