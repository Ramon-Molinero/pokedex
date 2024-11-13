import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';

import { PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    MongooseModule.forFeature([
      { 
        name: 'Pokemon', 
        schema: PokemonSchema 
      },
    ]),
  ],
  exports: [
    PokemonService
  ],
})
export class PokemonModule {}
