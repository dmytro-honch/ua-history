export const formatYear = (y: number, bc: string, ac: string): string => {
    if (y < 0) {
        return `${Math.abs(y)} ${bc}`;
    }
    return `${y} ${ac}`;
};
