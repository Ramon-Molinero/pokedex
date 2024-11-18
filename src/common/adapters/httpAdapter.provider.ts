import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";



/**
 * @class HttpAdapter
 * @description
 *  Esta clase es un adaptador HTTP que encapsula las operaciones básicas de HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) utilizando `Axios`.
 *  Proporciona métodos genéricos para realizar solicitudes HTTP, manejando errores en cada operación y lanzando excepciones descriptivas.
 * 
 *  * Esta clase de adaptadores son utiles para tener un mayor control sobre las librerias de terceros que se utilizan en la aplicacion.
 *
 * @implements {HttpAdapter}
 *
 * @author R.M
 * @version 1.0
 */



@Injectable()
export class HttpAdapter implements HttpAdapter {

    private axios: AxiosInstance = axios;


    /**
      * @method get
      * @description
      *  Realiza una solicitud HTTP `GET` para obtener datos de una URL especificada.
      *
      * @template T
      * @param {string} url - La URL desde donde se obtendrán los datos.
      *
      * @returns {Promise<T>} - Los datos obtenidos de la respuesta HTTP.
      *
      * @throws {Error} - Si ocurre un error durante la solicitud, lanza una excepción con un mensaje descriptivo.
      */
    
    async get<T>(url: string): Promise<T>{
        try {
            const { data } = await this.axios.get<T>(url);

            return data;

        } catch (error) {
            throw new Error(`Error fetching data: ${error}`);
        }
    }



    /**
      * @method post
      * @description
      *  Realiza una solicitud HTTP `POST` para enviar datos a una URL especificada.
      *
      * @template T
      * @param {string} url - La URL donde se enviarán los datos.
      *
      * @returns {Promise<T>} - Los datos obtenidos de la respuesta HTTP.
      *
      * @throws {Error} - Si ocurre un error durante la solicitud, lanza una excepción con un mensaje descriptivo.
      */
     

    async post<T>(url: string): Promise<T>{
        try {
            const { data } = await this.axios.post<T>(url);

            return data;

        } catch (error) {
            throw new Error(`Error fetching data: ${error}`);
        }
    }



    /**
      * @method put
      * @description
      *  Realiza una solicitud HTTP `PUT` para actualizar datos en una URL especificada.
      *
      * @template T
      * @param {string} url - La URL donde se actualizarán los datos.
      *
      * @returns {Promise<T>} - Los datos obtenidos de la respuesta HTTP.
      *
      * @throws {Error} - Si ocurre un error durante la solicitud, lanza una excepción con un mensaje descriptivo.
      */

    async put<T>(url: string): Promise<T>{
        try {
            const { data } = await this.axios.put<T>(url);

            return data;

        } catch (error) {
            throw new Error(`Error fetching data: ${error}`);
        }
    }




    /**
      * @method patch
      * @description
      *  Realiza una solicitud HTTP `PATCH` para actualizar datos en una URL especificada.
      *
      * @template T
      * @param {string} url - La URL donde se actualizarán los datos.
      *
      * @returns {Promise<T>} - Los datos obtenidos de la respuesta HTTP.
      *
      * @throws {Error} - Si ocurre un error durante la solicitud, lanza una excepción con un mensaje descriptivo.
      */

    async patch<T>(url: string): Promise<T>{
        try {
            const { data } = await this.axios.patch<T>(url);

            return data;

        } catch (error) {
            throw new Error(`Error fetching data: ${error}`);
        }
    }



    /**
      * @method delete
      * @description
      *  Realiza una solicitud HTTP `DELETE` para eliminar datos de una URL especificada.
      *
      * @template T
      * @param {string} url - La URL donde se eliminarán los datos.
      *
      * @returns {Promise<T>} - Los datos obtenidos de la respuesta HTTP.
      *
      * @throws {Error} - Si ocurre un error durante la solicitud, lanza una excepción con un mensaje descriptivo.
      */

    async delete<T>(url: string): Promise<T>{
        try {
            const { data } = await this.axios.delete<T>(url);

            return data;

        } catch (error) {
            throw new Error(`Error fetching data: ${error}`);
        }
    }
   
}