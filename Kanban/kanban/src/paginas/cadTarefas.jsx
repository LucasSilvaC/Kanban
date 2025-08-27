export function CadTarefas(){
    return(
        <form className="formulario">
            <h2 className="titulo">Cadastro da tarefa</h2>
            <label>Descrição:</label>
            <input type="text" required></input>
            <label>Setor:</label>
            <input type="text" required></input>
            <label>Usuário</label>
            <select>
                <option>Gewww</option>
                <option>Deborah Diva</option>
                <option>Elo Feia</option> 
                <option>Two nns</option> 
            </select>
            <label>Prioridade:</label>
            <select>
                <option>Alta</option>
                <option>Média</option>
                <option>Baixa</option>
            </select>
        </form>
    )
}