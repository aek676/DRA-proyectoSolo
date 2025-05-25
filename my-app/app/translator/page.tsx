import TranslatorForm from "@/components/TranslatorForm";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function page() {
    return (
        <ProtectedRoute>
            <TranslatorForm />
        </ProtectedRoute>
    );
};
