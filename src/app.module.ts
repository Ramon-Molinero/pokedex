import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfig } from './config/env.config';
import { JoiValitadionSchema } from './config/joi.validation';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ EnvConfig ], // conversiones y mapeo de variables de entorno
      validationSchema: JoiValitadionSchema // validacion de variables de entorno y establecer valores por defecto, actua antes de EnvConfig
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
      }),
      MongooseModule.forRoot( process.env.MONGODB ),

    PokemonModule,

    SeedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
