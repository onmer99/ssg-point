import Image from "next/image"

function CheckStatus(
  {
      checked, 
      handler,
      checkId, 
      label, 
      name,
      size
  }
  : 
  {
      checked: boolean, 
      handler: Function, 
      label: string, 
      checkId: number,
      name: string,
      size?: number,
  }) {

return (
  <div className="flex gap-5 items-center my-5">
      <input 
          id={label}
          name={name}
          type="checkbox" 
          checked={checked} 
          onChange={()=>handler(checkId, !checked)} 
          className="box-content w-5 h-5 rounded-full checked:bg-black appearance-none border border-black cursor-pointer checked:bg-[url('/assets/images/login/check.png')] checked:bg-[length:12px_10px] checked:bg-no-repeat checked:bg-center"
          style={{ width: `${size}px`, height: `${size}px` } } 
      />
      <label htmlFor={label}>{label}</label>
  </div>
)
}

export default CheckStatus