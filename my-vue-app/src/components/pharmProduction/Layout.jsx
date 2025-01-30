import imagem from "./images/p.png"


export function Layout(){
    return(
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <img src={imagem} alt="Produção"/>
        </div>
    )
}