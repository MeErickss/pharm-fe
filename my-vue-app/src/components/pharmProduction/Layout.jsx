import imagem from "./images/Design sem nome.svg"


export function Layout(){
    return(
        <div className="flex w-full h-full justify-center items-center">
            <img src={imagem} alt="Produção"/>
        </div>
    )
}