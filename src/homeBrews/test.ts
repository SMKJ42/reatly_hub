const addComma = (input: string) => {
  //adds commas to string
  let revDecimalIndex = input.length - input.indexOf(".") - 1;
  if (revDecimalIndex === -1) {
    revDecimalIndex = input.length - 1;
  }
  const output: string[] = [];
  function checkAddComma(arr: string[]) {
    if (arr && arr.length === 0) return output;
    const char: string | undefined = arr[0];
    if (char) output.push(char);
    arr.shift();
    if ((arr.length - revDecimalIndex) % 3 === 0) {
      output.push(",");
    }
    checkAddComma(arr);
  }
  checkAddComma(input.split(""));
  return output.join();
};

const test = "1220.555";
console.log(addComma(test));
