export function time(): string {
  const d = new Date();
  const jam = d.getHours();
  const menit = d.getMinutes();
  return `${jam}:${menit} WIB`;
}

export function Log(text: string): void {
  const style = `
        color: white;
        background-color: green;
    `;
  console.log(`%c ${time()} \n ${text} `, style);
}

export function Error(text: string): void {
  const style = `
        color: white;
        background-color: red;
    `;
  console.log(`%c ${time()} \n ${text} `, style);
}

export function Warn(text: string): void {
  const style = `
        color: black;
        background-color: yellow;
    `;
  console.log(`%c ${time()} \n ${text} `, style);
}
