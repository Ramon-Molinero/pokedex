import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { isValidObjectId, Model } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private _defaultLimit: number;

  /**
   * @constructor
   * 
   * @param {Model<Pokemon>} pokemonModel - Modelo de Mongoose para la colección de Pokémon, inyectado automáticamente.
   *
   * @description
   *  Constructor de la clase que inyecta el modelo de Pokémon mediante `@InjectModel`. 
   *  Esto permite interactuar con la base de datos de Pokémon en los métodos de la clase, 
   *  proporcionando acceso a las operaciones de Mongoose para la colección `Pokemon`.
   *  
   *  - **Inyección de Dependencias**: Utiliza el decorador `@InjectModel` para inyectar el modelo `pokemonModel`,
   *    permitiendo que la clase acceda a las funciones de Mongoose para interactuar con la colección de Pokémon.
   */
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) { 
    this._defaultLimit = this.configService.get<number>('default_limit');
  }





  
  
  /**
   * @author R.M
   * @version 1.0
   *
   * @param {CreatePokemonDto} createPokemonDto - DTO con la información del nuevo Pokémon.
   *
   * @description
   *  Este método permite crear un nuevo Pokémon en la base de datos. La lógica de creación incluye los siguientes pasos:
   *
   *  1. **Validar el nombre del Pokémon**: Convierte el nombre del Pokémon a minúsculas para asegurar la unicidad,
   *     sin importar el formato en el que fue ingresado.
   *
   *  2. **Crear el Pokémon**: Intenta crear el nuevo Pokémon en la base de datos usando los datos proporcionados
   *     en `createPokemonDto`.
   *
   *  3. **Control de errores**: Si ocurre un error durante la creación, se captura el error para verificar si es
   *     un conflicto de duplicación de datos:
   *     - Si el error es de código `11000` (clave duplicada), se lanza una excepción `BadRequestException`,
   *       indicando cuál propiedad y valor están duplicados.
   *     - Si ocurre otro tipo de error, se lanza una excepción `InternalServerErrorException` indicando
   *       que hubo un error inesperado.
   *
   * @returns {Pokemon} - El nuevo Pokémon creado.
   *
   * @throws {BadRequestException} Si alguna propiedad actualizada ya existe en la base de datos (controlado por `_errorHandler`).
   * @throws {InternalServerErrorException} Si ocurre un error inesperado durante la actualización (controlado por `_errorHandler`).
   */

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {

      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;

    } catch (error) {

      this._errorHandler(error, 'create');

    }
  }






  
  /**
    * @author R.M
    * @version 1.1
    *
    * @param {PaginationDto} paginationDto - DTO que contiene los parámetros de paginación (`limit` y `offset`).
    *
    * @description
    *  Este método recupera una lista paginada de Pokémon almacenados en la base de datos. La lógica de obtención sigue los siguientes pasos:
    *
    *  1. **Configurar la Paginación**: Extrae los valores `limit` y `offset` del objeto `paginationDto` para definir la cantidad
    *     de registros a obtener y el desplazamiento inicial.
    *  
    *  2. **Consultar la Base de Datos**: Realiza una consulta a la colección `pokemons` en la base de datos utilizando los
    *     parámetros de paginación:
    *      - **`limit`**: Define el número máximo de registros a devolver.
    *      - **`skip`**: Omite los primeros registros según el valor de `offset`.
    *      - **`sort`**: Ordena los resultados por el campo `no` en orden ascendente.
    *      - **`select`**: Excluye el campo `__v` de los resultados.
    *  
    *  3. **Retornar el Resultado**: Devuelve la lista de Pokémon encontrados, según los parámetros de paginación.
    *  
    *  4. **Control de Errores**: Si ocurre un error durante la operación, se delega el manejo a `_errorHandler`, especificando
    *     el nombre de la función para facilitar la depuración.
    *
    * @returns {Promise<Pokemon[]>} - Una lista paginada de Pokémon encontrados en la base de datos.
    *
    * @throws {BadRequestException} Si ocurre un error relacionado con los datos de entrada o la consulta.
    * @throws {InternalServerErrorException} Si ocurre un error inesperado durante la operación.
    */

  async findAll( paginationDto: PaginationDto): Promise<Pokemon[]> {
    try {
      
      const { limit = this._defaultLimit, offset = 0 } = paginationDto;
      const pokemons = await this.pokemonModel.find()
        .limit(limit)
        .skip(offset)
        .sort({ no: 1 })
        .select('-__v');

      return pokemons;

    } catch (error) {

      this._errorHandler(error, 'findAll');

    }

  }





  
  
  /**
   * @author R.M
   * @version 1.0
   *
   * @param {string} term - Nombre o número del pokemon
   *
   * @description
   *  Este método busca un Pokémon en la base de datos utilizando un término de búsqueda,
   *  que puede ser el nombre o el número del Pokémon.
   *  La búsqueda se realiza de la siguiente manera:
   *
   *  1. **Verificar si el término es convertible a número**: Si el término puede convertirse a un número,
   *     busca el Pokémon por su propiedad `no` (número único).
   *
   *  2. **Verificar si el término es un MongoID válido**: Si el Pokémon no se encontró por número y
   *     el término es un ID de Mongo válido, intenta encontrar el Pokémon por su ID.
   *
   *  3. **Buscar por nombre si no se encuentra por número o ID**: Si el Pokémon no se encuentra por
   *     número o ID, intenta buscarlo utilizando el nombre del Pokémon, ignorando mayúsculas y
   *     espacios adicionales.
   *
   *  4. **Lanzar excepción si no se encuentra el Pokémon**: Si el Pokémon no se encuentra después
   *     de las tres búsquedas anteriores, lanza una excepción `BadRequestException`.
   *
   *  5. **Control de errores mediante `_errorHandler`**: Si ocurre un error durante la operación, se delega el manejo de errores a `_errorHandler`, el cual controla las excepciones y lanza:
   *      - `BadRequestException` en caso de un error de clave duplicada.
   *      - `InternalServerErrorException` para errores inesperados.
   *
   * @returns {Promise<Pokemon>} - El Pokémon encontrado.
   *
   * @throws {BadRequestException} Si alguna propiedad actualizada ya existe en la base de datos o no encontrada (controlado por `_errorHandler`).
   * @throws {InternalServerErrorException} Si ocurre un error inesperado durante la actualización (controlado por `_errorHandler`).
   */

  async findOne(term: string): Promise<Pokemon> {

    try {

      let pokemon: Pokemon;

      if (!isNaN(+term))
        pokemon = await this.pokemonModel.findOne({ no: term });


      if (!pokemon && isValidObjectId(term))
        pokemon = await this.pokemonModel.findById(term);


      if (!pokemon)
        pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });


      if (!pokemon)
        throw new BadRequestException(`Pokemon with name or no ${term} not found`);

      return pokemon;

    } catch (error) {

      this._errorHandler(error, 'findOne');

    }
  }





  
  
  /**
   * @author R.M
   * @version 1.0
   *
   * @param {string} term - Nombre o número del Pokémon para identificarlo en la base de datos.
   * @param {UpdatePokemonDto} updatePokemonDto - DTO con la información actualizada del Pokémon.
   *
   * @description
   *  Este método actualiza la información de un Pokémon en la base de datos. La lógica de actualización sigue estos pasos:
   *
   *  1. **Buscar el Pokémon**: Utiliza el término (`term`) para encontrar el Pokémon correspondiente en la base de datos mediante el método `findOne`.
   *  
   *  2. **Validar y Normalizar el Nombre**: Si se incluye un nombre en los datos de actualización, se convierte a minúsculas para asegurar la unicidad.
   *
   *  3. **Actualizar el Pokémon**: Ejecuta la actualización de los datos del Pokémon con `updateOne` y aplica los cambios.
   *  
   *  4. **Control de errores mediante `_errorHandler`**: Si ocurre un error durante la operación, se delega el manejo de errores a `_errorHandler`, el cual controla las excepciones y lanza:
   *      - `BadRequestException` en caso de un error de clave duplicada.
   *      - `InternalServerErrorException` para errores inesperados.
   *
   * @returns {Promise<UpdatePokemonDto>} - El Pokémon actualizado con los nuevos valores.
   *
   * @throws {BadRequestException} Si alguna propiedad actualizada ya existe en la base de datos o no encontrada (controlado por `_errorHandler`).
   * @throws {InternalServerErrorException} Si ocurre un error inesperado durante la actualización (controlado por `_errorHandler`).
   */

  async update(term: string, updatePokemonDto: UpdatePokemonDto): Promise<UpdatePokemonDto> {

    try {
      const pokemon = await this.findOne(term);

      if (updatePokemonDto.name) 
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

      await pokemon.updateOne(updatePokemonDto, { new: true });

      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {

      this._errorHandler(error, 'update');
      
    }

  }





  
  /**
   * @author R.M
   * @version 1.0
   *
   * @param {string} id - El ID del Pokémon que se desea eliminar.
   *
   * @description
   *  Este método elimina un Pokémon de la base de datos utilizando su ID. La lógica de eliminación sigue estos pasos:
   *
   *  1. **Eliminar el Pokémon**: Intenta encontrar y eliminar el Pokémon en la base de datos usando `deleteOne`.
   *      - Si no se encuentra el Pokémon o pokemonDeleted.deletedCount === 0, lanza una excepción `BadRequestException`.
   *
   *  2. **Control de errores mediante `_errorHandler`**: Si ocurre un error durante la operación, se delega el manejo de errores a `_errorHandler`, el cual controla las excepciones y lanza:
   *      - `BadRequestException` en caso de un error de clave duplicada o no encontrada.
   *      - `InternalServerErrorException` para errores inesperados.
   *
   * @returns {Promise<Pokemon>} - El Pokémon eliminado, si fue encontrado y eliminado con éxito.
   *
   * @throws {BadRequestException} Si alguna propiedad actualizada ya existe en la base de datos o no encontrada (controlado por `_errorHandler`).
   * @throws {InternalServerErrorException} Si ocurre un error inesperado durante la actualización (controlado por `_errorHandler`).
   */

  async remove(id: string) {
    try {
     
      let pokemonDeleted = await this.pokemonModel.deleteOne( {_id: id} );
      
       if(!pokemonDeleted || pokemonDeleted.deletedCount === 0) 
         throw new BadRequestException('Pokemon don`t exist');
  
      return pokemonDeleted;

    }catch(error){

      this._errorHandler(error, 'remove');

    }
  }





  
  
  /**
   * @author R.M
   * @version 1.0
   * 
   * @private
   * 
   * @param {any} error - Objeto de error capturado durante una operación de base de datos.
   * @param {string} [fnName] - Nombre de la función donde ocurrió el error (opcional).
   *
   * @description
   *  Maneja los errores que ocurren en las operaciones de base de datos, lanzando excepciones específicas 
   *  según el tipo de error.
   * 
   *  1. **Errores de Duplicación**: Si el error tiene el código `11000`, significa que hubo un conflicto 
   *     de clave duplicada en la base de datos. En este caso, lanza una `BadRequestException` indicando
   *     la propiedad y el valor duplicados.
   * 
   *  2. **Errores Generales**: Para otros errores, lanza una `InternalServerErrorException` con el nombre
   *     de la función donde ocurrió el error, si se proporciona.
   *  
   *  - Registra el error en la consola para facilitar la depuración.
   *
   * @throws {BadRequestException} Si el error es de clave duplicada en la base de datos o si no se encuentra un Pokémon.
   * @throws {InternalServerErrorException} Para errores inesperados en las operaciones de base de datos.
   */

  private _errorHandler(error: any, fnName: string) {

    if (error.code === 11000) {
      const key = Object.keys(error.keyValue)[0];
      const value = error.keyValue[key];

      throw new BadRequestException(`Pokemon property ${key} with ${value} already exists`)
    }

    if(error.status === 400) 
      throw new BadRequestException(` Error from ${fnName}() - ${error.message}`);

    
    throw new InternalServerErrorException(` Error from ${fnName}(), ${error.message}`);
  }

}
