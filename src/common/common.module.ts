import { Module } from '@nestjs/common';
import { HttpAdapter } from './adapters/httpAdapter.provider';

@Module({
    providers: [
        HttpAdapter
    ],
    exports: [
        HttpAdapter
    ],
})
export class CommonModule {}
