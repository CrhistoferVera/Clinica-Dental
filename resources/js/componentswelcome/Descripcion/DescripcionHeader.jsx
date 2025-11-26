import { MapPin, Mail, MessageCircle } from "lucide-react";

export default function DescripcionHeader() {
    return (
        <div className="flex  md:items-center justify-between border-b-2 border-black md:pb-3">
            
            <h2 className="text-3xl md:text-4xl font-bold mb-2 md:mb-0">
                Barbería
            </h2>

            <div className="flex items-center gap-4 ">

                <div className="flex items-center gap-1">
                    <MapPin className="w-5 h-5 text-black" />
                    <span className="hidden md:inline text-sm text-gray-700">Dirección</span>
                </div>

                <div className="flex items-center gap-1">
                    <Mail className="w-5 h-5 text-black" />
                    <span className="hidden md:inline text-sm text-gray-700">Email</span>
                </div>

                <div className="flex items-center gap-1">
                    <MessageCircle className="w-5 h-5 text-black" />
                    <span className="hidden md:inline text-sm text-gray-700">Whatsapp</span>
                </div>

            </div>
        </div>
    );
}
