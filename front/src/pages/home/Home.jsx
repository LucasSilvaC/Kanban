import Header from "../../components/header/header"
import Frame from "../../organisms/frame/Frame"

export default function HomeKanban() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <Frame />
        </div>
    );
}