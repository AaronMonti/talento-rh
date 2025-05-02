export const getModalidadColor = (modalidad: string) => {
    const styles = {
        remoto: 'bg-green-100 text-green-800',
        presencial: 'bg-blue-100 text-blue-800',
        hibrido: 'bg-purple-100 text-purple-800',
        default: 'bg-gray-100 text-gray-800'
    };
    
    return styles[modalidad?.toLowerCase() as keyof typeof styles] || styles.default;
};