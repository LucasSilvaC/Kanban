import { Routes, Route } from "react-router-dom";
import { Inicial } from "../paginas/inicial";
import { Quadro } from "../componentes/quadro";
import { CadTarefas } from "../paginas/cadTarefas";
import { CadUsuario } from "../paginas/cadUsuario";

export function Rotas(){
    return(
        <Routes>
            <Route path="/" element={<Inicial/>}>
                <Route index element={<Quadro/>}/>
                <Route path="cadusuario" element={<CadUsuario/>}/>
                <Route path="cadTarefa" element={<CadTarefas/>}/>

            </Route>    

        </Routes>

    )
}