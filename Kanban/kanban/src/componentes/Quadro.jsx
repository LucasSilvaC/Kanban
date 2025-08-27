import { Coluna } from "./coluna";

export function Quadro(){
    return(
        <main className="quadro">
            <h2 className="titulo">To do</h2>
            <Coluna/>
            <h2 className="titulo">Doing</h2>
            <Coluna/>
            <h2 className="titulo">Done</h2>
            <Coluna/>
            
        </main>
    )
}