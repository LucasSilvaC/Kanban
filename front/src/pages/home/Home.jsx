import Header from "../../components/header/header"
import Frame from "../../organisms/frame/Frame"

export default function HomeKanban() {
    return (
        <div
            className="min-h-screen bg-gray-100 flex flex-col"
            role="application"
            aria-label="Aplicativo Kanban"
        >
            <Header />
            <main
                role="main"
                tabIndex={0}
                aria-label="Área principal do Kanban com quadro de tarefas"
                className="flex-grow"
                aria-describedby="home-description"
            >
                <div id="home-description" className="sr-only">
                    Página principal do aplicativo Kanban. Contém um cabeçalho com navegação
                    e um quadro Kanban com colunas de tarefas que podem ser arrastadas e soltas.
                </div>
                <Frame />
            </main>
        </div>
    );
}