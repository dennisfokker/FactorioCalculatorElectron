import { ModalResult } from '../models/Helpers/modalResult';
import { Observable } from 'rxjs';
export interface ModalComponent
{
    data: any;
    modalClosed: Observable<ModalResult>;
}
