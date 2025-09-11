import Header from "../../components/header/header";
import TableManager from "../../organisms/tableManager/TableManager";

export default function TableViews() {
    return (
        <>
            <Header />
            <main
                role="tableView"
                tabIndex={0}
                aria-label="Área principal da visualização de tabelas"
                className="flex-grow"
            >
                <TableManager />
            </main>
        </>
    )
}