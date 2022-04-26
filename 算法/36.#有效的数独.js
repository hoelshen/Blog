// 请你判断一个 9 x 9 的数独是否有效。只需要 根据以下规则 ，验证已经填入的数字是否有效即可。

// 数字 1-9 在每一行只能出现一次。
// 数字 1-9 在每一列只能出现一次。
// 数字 1-9 在每一个以粗实线分隔的 3x3 宫内只能出现一次。（请参考示例图）
//  

// 注意：

// 一个有效的数独（部分已被填充）不一定是可解的。
// 只需要根据以上规则，验证已经填入的数字是否有效即可。
// 空白格用 '.' 表示。


/**
 * @param {character[][]} board
 * @return {boolean}
 */
var isValidSudoku = function(board) {
    let row = new Array(9).fill(0).map(() => new Array(9).fill(0));
    let col = new Array(9).fill(0).map(() => new Array(9).fill(0));
    let box = new Array(9).fill(0).map(() => new Array(9).fill(0));
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] !== '.') {
                let num = parseInt(board[i][j]);
                let boxIndex = parseInt(i / 3) * 3 + parseInt(j / 3);
                if (row[i][num - 1] || col[j][num - 1] || box[boxIndex][num - 1]) {
                    return false;
                }
                row[i][num - 1] = 1;
                col[j][num - 1] = 1;
                box[boxIndex][num - 1] = 1;
            }
        }
    }
    return true;
};

// 分三种情况  
// 第一种就是检查对应的行，然后检查是否有重复的数字，如果有重复的数字，那么就返回false，如果没有重复的数字，那么就返回true。
// 第二种检查列
// 第三种检查宫