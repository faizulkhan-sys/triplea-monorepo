export declare function encrypt(text: string): {
    content: string;
    tag: string;
};
export declare function decrypt(encrypted: {
    tag: string;
    content: string;
}): string;
