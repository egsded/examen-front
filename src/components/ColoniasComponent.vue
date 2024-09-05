<template>
    <div>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Examen</a>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                        <a class="nav-link active" aria-current="page" href="/">Colonias</a>
                        <a class="nav-link active" href="/domicilios">Domicilios</a>
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
                <h1>Colonias</h1>
            </div>
            <form @submit.prevent="crearColonia">
                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre</label>
                    <input type="text" class="form-control" id="nombre" v-model="colonia.nombre">
                </div>
                <button type="submit" class="btn btn-primary">Guardar</button>
            </form>
        </div>
        <div class="text-center mt-4">
            <h2>Lista de colonias</h2>
        </div>
        <div class="row">
            <div class="col"></div>
            <table class="table table-striped col">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="col in colonias" :key="col.idColonia">
                        <td>{{ col.idColonia }}</td>
                        <td>{{ col.nombre }}</td>
                        <td>
                            <button class="btn btn-info" @click="editarColonia(col)">Editar</button>
                            <button class="btn btn-danger" @click="eliminarColonia(col.idColonia)">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="col"></div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            colonia: {
                nombre: ''
            },
            colonias: [],
            modoEditar: false,
            coloniaSeleccionada: null,
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
                this.getListaColonia();
            } catch (error) {
                console.error('Error al obtener el token: ', error);
            }
        },
        async getListaColonia() {
            try {
                const response = await axios.get('/colonias', {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                this.colonias = response.data;
            } catch (error) {
                console.error('Error al cargar las colonias: ', error);
            }
        },
        async crearColonia() {
            try {
                if (this.modoEditar) {
                    await axios.put(`colonia/editar/${this.coloniaSeleccionada}`, this.colonia, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    })
                } else {
                    await axios.post('/colonia/crear', this.colonia, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    });
                }
                this.getListaColonia();
                this.resetForm();
            } catch (error) {
                console.error('Error al guardar la colonia: ', error);
            }
        },
        async eliminarColonia(id) {
            try {
                await axios.delete(`/colonia/eliminar/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                this.getListaColonia();
            } catch (error) {
                console.error('Error al eliminar la Colonia: ', error);
            }
        },
        resetForm() {
            this.colonia = {
                nombre: ''
            }
            this.modoEditar = false;
            this.coloniaSeleccionada = null;
        },
        editarColonia(colonia) {
            this.colonia = { ...colonia };
            this.modoEditar = true;
            this.coloniaSeleccionada = colonia.idColonia;
        }
    }
}
</script>