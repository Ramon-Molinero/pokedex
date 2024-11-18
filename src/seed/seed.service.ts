import { BadRequestException, Injectable } from '@nestjs/common';

import { PokeResponse } from './interfaces/poke-response.interface';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';


@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly httpService: HttpService
  ) {}
  



  /**
    * @author R.M
    * @version 1.0
    *
    * @description
    *  Este método elimina los datos existentes en la colección de Pokémon y los reemplaza con una nueva
    *  carga de datos obtenida desde la PokeAPI. La lógica del método sigue estos pasos:
    *
    *  1. **Eliminar datos existentes**: Limpia la colección `pokemons` en la base de datos usando `deleteMany`.
    *
    *  2. **Obtener datos desde la API**: Realiza una solicitud HTTP a la PokeAPI para obtener una lista de Pokémon
    *      con un límite de 650. La solicitud maneja los errores usando `catchError` para capturar fallos en la
    *      solicitud y lanzar una excepción `BadRequestException`.
    *
    *  3. **Transformar los datos**: Procesa la lista de resultados para extraer el número (`no`) y el nombre de cada Pokémon.
    *
    *  4. **Insertar nuevos datos**: Inserta los datos procesados en la base de datos usando `insertMany`.
    *      - **Errores de Duplicación**: Si ocurre un error por claves duplicadas (`code 11000`), se registra una advertencia.
    *      - **Errores Generales**: Si ocurre otro error inesperado, se captura y lanza una excepción `BadRequestException`.
    *
    *  5. **Retornar resultado**: Si la operación es exitosa, retorna un mensaje confirmando la recarga de datos.
    *
    * @returns {Promise<string>} - Un mensaje indicando que la recarga de datos fue exitosa.
    *
    * @throws {BadRequestException} Si ocurre un error al obtener los datos desde la API o si ocurre un error inesperado durante la inserción.
    */

  async excuteSeed() {

    // Eliminamos datos existentes en la colección de pokemons
    await this.pokemonModel.deleteMany({});

    const result = this.httpService.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
      .pipe(
        map(({ data }) => data.results),
        catchError(error => {
          console.error('Error fetching data:', error);
          return throwError(() => new BadRequestException('Error in the excuteSeed method'));
        })
      );


      const results = await firstValueFrom(result);

      const pokemonData = results.map(({ name, url }) => {
        const urlParts = url.split('/');
        const no = +urlParts[urlParts.length - 2];
        return { no, name };
      });
  
      try {
        await this.pokemonModel.insertMany(pokemonData, { ordered: false });
      } catch (error) {
        if (error.code === 11000) {
          console.warn('Duplicate key error:', error.message);
        } else {
          console.error('Unexpected error:', error);
          throw new BadRequestException('Unexpected error:', error);
        }
      }
    
    return 'Recarga de datos exitosa';
  }

}
