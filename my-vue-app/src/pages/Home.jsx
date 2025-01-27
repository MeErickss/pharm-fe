import image from "./images/g.png"
export function Home(){

    return(
      <div className="flex p-4 bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Home</h1>
        <div className=""><img src={image} alt="" /></div>
      </div>
    )
}