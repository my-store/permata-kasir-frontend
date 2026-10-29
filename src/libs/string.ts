export function addComma(str: string | number) {
  return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function convertFromHex(get_hex: any) {
  let hex = get_hex.toString(); //force conversion
  let str = "";
  for (let i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

export function convertToHex(hex_str: string) {
  let hex = "";
  for (let i = 0; i < hex_str.length; i++) {
    hex += "" + hex_str.charCodeAt(i).toString(16);
  }
  return hex;
}
