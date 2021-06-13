import { Criterias } from './Criterias.entity';
export declare class SearchFilters {
    id: number;
    idx: string;
    name: string;
    criteria: Criterias;
    value: string;
    created_on: Date;
    is_active: boolean;
    is_default_filter: boolean;
    is_obsolete: boolean;
    modified_on: Date | null;
    created_by: string;
}
