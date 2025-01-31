import image from "./images/g.png"
import farmacia  from "./images/farmacia.png"
import filtros  from "./images/filtros.png"
import purifier  from "./images/purifier.png"


export function Home(){

    return(
      <div className="flex flex-wrap w-screen h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-4 p-8">Home</h1>
        <div className="w-7/12"><img src={image}/></div>

        <div className="flex flex-wrap flex-col px-4 gap-10 mx-9 bg-gray-300">
          <div className="rounded-tl-lg rounded-br-lg mt-4 hover:shadow-2xl"><img width={280} src={farmacia} /></div>
          <div className="rounded-tl-lg rounded-br-lg hover:shadow-2xl"><img width={280} src={filtros} /></div>
          <div className="rounded-tl-lg rounded-br-lg hover:shadow-2xl"><img width={280} src={purifier} /></div>
        </div>
      </div>
    )
}