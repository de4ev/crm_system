import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Position } from "../interfaces";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PositionService {
    constructor(private http: HttpClient) {
    }

    fetch(categoryId: string): Observable<Position[]> {
        return this.http.get<Position[]>(`/api/position/${categoryId}`)
    }
    
    create(position: Position): Observable<Position> {
        return this.http.post<Position>(`/api/position`, position)
    }
}