export {};

// AE 動画作成用
const numDice = 2;
const count = 50;

interface DiceResult {
  index: number;
  values: number[];
  sum: number;
  count: number;
  distribution: number[];
}

const diceValues: DiceResult[] = [];
const distributions: number[] = Array(numDice * 6 + 1).fill(0); // 出目の和の分布(※0オリジンのため余分に1要素必要)

for (let i = 0; i < count; i++) {
  const vals: number[] = [];
  let sum = 0;
  for (let j = 0; j < numDice; j++) {
    // ランダム
    vals.push(Math.floor(Math.random() * 6) + 1);

    sum += vals[j];
  }
  distributions[sum]++;
  diceValues.push({
    index: i,
    values: vals,
    sum: sum,
    count: numDice * (i + 1),
    distribution: [...distributions],
  });
}

// console.log(diceValues);
console.log(JSON.stringify(diceValues));
