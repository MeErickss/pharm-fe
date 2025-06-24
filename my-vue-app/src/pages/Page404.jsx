import { useNavigate } from "react-router-dom";


export function Pagina404(){
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center bg-neutral-200" onClick={()=> navigate("/")}>
            <div className="text-center rounded-full w-[61rem] h-[60rem] p-[10rem] bg-neutral-300 text-neutral-400">
                <span className="flex text-[3rem] justify-center w-full border-b-2 border-spacing-4 border-neutral-400">Ops,</span>
                <h1 className="text-[20rem] flex justify-center w-full border-b-2 border-spacing-4 border-neutral-400">404</h1>
                <span className="text-[3rem]">Página procurada não encontrada</span>
            </div>
        </div>
    )
}