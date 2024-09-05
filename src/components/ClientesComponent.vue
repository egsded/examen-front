<template>
    <div>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Examen</a>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                        <a class="nav-link active" href="/">Colonias</a>
                        <a class="nav-link active" href="/domicilios">Domicilios</a>
                        <a class="nav-link active" aria-current="page" href="/clientes">Clientes</a>
                    </div>
                </div>
            </div>
        </nav>
        <div class="text-center mt-4">
            <h3>Examen</h3>
        </div>
        <div class="container border rounded-2 pb-4 pt-2 px-4">
            <div class="text-center">
                <h1>Clientes</h1>
            </div>
            <form @submit.prevent="crearCliente">
                <div class="mb-3">
                    <label for="nombres" class="form-label">Nombre(s)</label>
                    <input type="text" class="form-control" id="nombres" v-model="cliente.nombres">
                </div>
                <div class="mb-3">
                    <label for="apellidoPaterno" class="form-label">Apellido Paterno</label>
                    <input type="text" class="form-control" id="apellidoPaterno" v-model="cliente.apellidoPaterno">
                </div>
                <div class="mb-3">
                    <label for="apellidoMaterno" class="form-label">Apellido Materno</label>
                    <input type="text" class="form-control" id="apellidoMaterno" v-model="cliente.apellidoMaterno">
                </div>
                <div class="mb-3">
                    <label for="correoElectronico" class="form-label">Correo Electronico</label>
                    <input type="text" class="form-control" id="correoElectronico" v-model="cliente.correoElectronico">
                </div>
                <div class="mb-3">
                    <label for="idDomicilio" class="form-label">Domicilio</label>
                    <input type="text" class="form-control" id="idDomicilio" v-model="cliente.idDomicilio">
                </div>
                <button type="submit" class="btn btn-primary">Guardar</button>
            </form>
        </div>
        <div class="text-center mt-4">
            <h2>Lista de Clientes</h2>
        </div>
        <div class="container">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>A. Paterno</th>
                        <th>A. Materno</th>
                        <th>Correo</th>
                        <th>Domicilio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cli in clientes" :key="cli.idClientes">
                        <td>{{ cli.idClientes }}</td>
                        <td>{{ cli.nombres }}</td>
                        <td>{{ cli.apellidoPaterno }}</td>
                        <td>{{ cli.apellidoMaterno }}</td>
                        <td>{{ cli.correoElectronico }}</td>
                        <td>{{ cli.Domicilio.calle }} {{ cli.Domicilio.numeroExterno ? "#" : "sin numero" }}{{
                            cli.Domicilio.numeroExterno }} {{ cli.Domicilio.numeroInterno }} colonia {{ cli.Colonia }}
                        </td>
                        <td>
                            <button class="btn btn-info" @click="editarCliente(cli)">Editar</button>
                            <button class="btn btn-danger" @click="eliminarCliente(cli.idClientes)">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {
            cliente: {
                nombres: '',
                apellidoPaterno: '',
                apellidoMaterno: '',
                correoElectronico: '',
                idDomicilio: 0
            },
            clientes: [],
            modoEditar: false,
            clienteSeleccionado: null,
            token: null
        };
    },
    created() {
        this.getToken();
    },
    methods: {
        async getToken() {
            try {
                const data = {
                    "email": "correo@gmail.com",
                    "password": "12345"
                }
                const token = await axios.post('/login', data);
                this.token = token.data.token;
                this.getListaClientes();
            } catch (error) {
                console.error('Error al obtener el token: ', error);
            }
        },
        async getListaClientes() {
            try {
                const response = await axios.get('/clientes', {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                this.getColonia(response.data)
            } catch (error) {
                console.error('Error al cargar los clientes: ', error);
            }
        },
        async crearCliente() {
            try {
                if (this.modoEditar) {
                    await axios.put(`/cliente/editar/${this.clienteSeleccionado}`, this.cliente, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    });
                } else {
                    await axios.post('/cliente/crear', this.cliente, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    })
                }
                this.getListaClientes();
                this.resetForm();
            } catch (error) {
                console.error('Error al guardar el cliente: ', error);
            }
        },
        async eliminarCliente(id) {
            try {
                await axios.delete(`/cliente/eliminar/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                this.getListaClientes();
            } catch (error) {
                console.error('Error al eliminar el cliente: ', error);
            }
        },
        async getColonia(cliente) {
            try {
                const clientes = [];
                for (const element of cliente) {
                    const response = await axios.get(`/colonia/${element.Domicilio.idColonia}`, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    });

                    clientes.push({
                        idClientes: element.idClientes,
                        nombres: element.nombres,
                        apellidoPaterno: element.apellidoPaterno,
                        apellidoMaterno: element.apellidoMaterno,
                        correoElectronico: element.correoElectronico,
                        idDomicilio: element.idDomicilio,
                        Domicilio: element.Domicilio,
                        Colonia: response.data.nombre
                    })
                }
                this.clientes = clientes
            } catch (error) {
                console.error('Error al buscar la colonia: ', error);
            }
        },
        resetForm() {
            this.cliente = {
                nombres: '',
                apellidoPaterno: '',
                apellidoMaterno: '',
                correoElectronico: '',
                idDomicilio: 0
            }
            this.modoEditar = false;
            this.clienteSeleccionado = null;
        },
        editarCliente(cliente) {
            this.cliente = { ...cliente };
            this.modoEditar = true;
            this.clienteSeleccionado = cliente.idClientes;
        }
    }
}
</script>