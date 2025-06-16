import { useState } from "react"

export function Teste(){
  const [variavel, setVariavel] = useState("Hello World")
  return(
    <div>
      <div>{variavel} a</div>
    </div>
  )
}

