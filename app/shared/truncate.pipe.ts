import {  PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform  {
  transform(value: string, argLimit: string, argTrail: string) : string {
    let limit = !!argLimit ? parseInt(argLimit, 10) : 10;
    let trail = !!argTrail ? argTrail : '...';
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}