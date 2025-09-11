import Header from "../../components/header/header"
import Frame from "../../organisms/frame/Frame"

export default function HomeKanban() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <main
                role="main"
                tabIndex={0}
                aria-label="Área principal do Kanban"
                className="flex-grow"
            >
                <Frame />
            </main>
        </div>
    );
}