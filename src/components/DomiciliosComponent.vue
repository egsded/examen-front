<template>
    <div>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Examen</a>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                        <a class="nav-link active" href="/">Colonias</a>
                        <a class="nav-link active" aria-current="page" href="/domicilios">Domicilios</a>
                        <a class="nav-link active" href="/clientes">Clientes</a>
                    </div>
                </div>
            </div>
        </nav>
        <div class="text-center mt-4">
            <h3>Examen</h3>
        </div>
        <div class="container border rounded-2 pb-4 pt-2 px-4">
            <div class="text-center">
                <h1>Domicilios</h1>
            </div>
            <form @submit.prevent="crearDomicilio">
                <div class="mb-3">
                    <label for="calle" class="form-label">Calle</label>
                    <input type="text" class="form-control" id="calle" v-model="domicilio.calle">
                </div>
                <div class="mb-3">
                    <label for="numeroInterno" class="form-label">Numero Interior</label>
                    <input type="text" class="form-control" id="numeroInterno" v-model="domicilio.numeroInterno">
                </div>
                <div class="mb-3">
                    <label for="numeroExterno" class="form-label">Numero Externo</label>
                    <input type="text" class="form-control" id="numeroExterno" v-model="domicilio.numeroExterno">
                </div>
                <div class="mb-3">
                    <label for="idColonia" class="form-label">Colonia</label>
                    <input type="text" class="form-control" id="idColonia" v-model="domicilio.idColonia">
                </div>
                <button type="submit" class="btn btn-primary">Guardar</button>
            </form>
        </div>
        <div class="text-center mt-4">
            <h2>Lista de domicilios</h2>
        </div>
        <div class="container">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Calle</th>
                        <th>Numero Interior</th>
                        <th>Numero Exterior</th>
                        <th>Colonia</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="dom in domicilios" :key="dom.idDomicilios">
                        <td>{{ dom.idDomicilios }}</td>
                        <td>{{ dom.calle }}</td>
                        <td>{{ dom.numeroInterno }}</td>
                        <td>{{ dom.numeroExterno }}</td>
                        <td>{{ dom.Colonium.nombre }}</td>
                        <td>
                            <button class="btn btn-info" @click="editarDomicilio(dom)">Editar</button>
                            <button class="btn btn-danger"
                                @click="eliminarDomicilio(dom.idDomicilios)">Eliminar</button>
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
            domicilio: {
                calle: '',
                numeroInterno: null,
                numeroExterno: null,
                idColonia: 0
            },
            domicilios: [],
            modoEditar: false,
            domicilioSeleccionado: null,
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
                this.getListaDomicilios();
            } catch (error) {
                console.error('Error al obtener el token: ', error);
            }
        },
        async getListaDomicilios() {
            try {
                const response = await axios.get('/domicilios', {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                this.domicilios = response.data;
            } catch (error) {
                console.error('Error al cargar los domicilios: ', error);
            }
        },
        async crearDomicilio() {
            try {
                if (this.modoEditar) {
                    await axios.put(`/domicilio/editar/${this.domicilioSeleccionado}`, this.domicilio, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    });
                } else {
                    await axios.post('/domicilio/crear', this.domicilio, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    })
                }
                this.getListaDomicilios();
                this.resetForm();
            } catch (error) {
                console.error('Error al guardar el domicilio: ', error);
            }
        },
        async eliminarDomicilio(id) {
            try {
                await axios.delete(`/domicilio/eliminar/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                this.getListaDomicilios();
            } catch (error) {
                console.error('Error al eliminar el Domicilio: ', error);
            }
        },
        resetForm() {
            this.domicilio = {
                calle: '',
                numeroInterno: null,
                numeroExterno: null,
                idColonia: 0
            }
            this.modoEditar = false;
            this.domicilioSeleccionado = null;
        },
        editarDomicilio(domicilio) {
            this.domicilio = { ...domicilio };
            this.modoEditar = true;
            this.domicilioSeleccionado = domicilio.idDomicilios;
        }
    }
}
</script>