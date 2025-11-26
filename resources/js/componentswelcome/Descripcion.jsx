import { useState } from "react";
import DescripcionHeader from "./Descripcion/DescripcionHeader";
import DescripcionDesktop from "./Descripcion/DescripcionDesktop";
import DescripcionMobile from "./Descripcion/DescripcionMobile";

export default function Descripcion() {

    const [expanded, setExpanded] = useState(false);

    return (
        <div className="p-4 mt-10 bg-white w-full">
            <DescripcionHeader />
            <DescripcionDesktop />
            <DescripcionMobile expanded={expanded} setExpanded={setExpanded} />
        </div>
    );
}
