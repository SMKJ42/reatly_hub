// export const addComma = (input: string) => {
//   const output: string[] = [];

//   let refDecimalIndex = input.length - input.indexOf(".") - 1;
//   if (refDecimalIndex === -1) {
//     refDecimalIndex = input.length - 1;
//   }

//   function checkAddComma(arr: string[]) {
//     const char: string | undefined = arr[0];

//     if (char) output.push(char);
//     else return output;

//     arr.shift();

//     if ((arr.length - refDecimalIndex) % 3 === 0) {
//       output.push(",");
//     }

//     checkAddComma(arr);
//   }
//   checkAddComma(input.split(""));
//   return output.join();
// };
