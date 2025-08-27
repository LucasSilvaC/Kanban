export function CadUsuario(){
    
    return(

        <form className="formulario">

            <h2 className="titulo">Cadastro de Usuário</h2>

            <label>Nome:</label>
            <input type="text" required/>

            <label>E-mail:</label>
            <input type="email" required/>

            <button type="submit">Cadastrar</button>
            </form>

    )
}