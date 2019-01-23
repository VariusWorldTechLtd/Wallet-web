<template>
  <div class="user">
    <div class="photo">
      <img src="/static/img/faces/face-2.jpg"/>
    </div>
    <div class="info">
      <a data-toggle="collapse" @click="toggleMenu" href="javascript:void(0)">
           <span>
             Chet Faker
             <b class="caret"></b>
          </span>
      </a>
      <div class="clearfix"></div>
      <div>
        <el-collapse-transition>
          <ul class="nav" v-show="!isClosed">
            <li>
              <a href="javascript:void(0)">
                <span class="sidebar-mini">Mp</span>
                <span class="sidebar-normal">My Profile</span>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <span class="sidebar-mini">Ep</span>
                <span class="sidebar-normal">Edit Profile</span>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <span class="sidebar-mini">S</span>
                <span class="sidebar-normal">Settings</span>
              </a>
            </li>
            <li>
                <a href="javascript:void(0)" @click="logout">
                  <span class="sidebar-mini">L</span>
                  <span class="sidebar-normal">Logout</span>
                </a>
            </li>
          </ul>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>
<script>
  import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
  import Router from '../../../router'
  export default {
    components: {
      [CollapseTransition.name]: CollapseTransition
    },
    data() {
      return {
        isClosed: true
      }
    },
    methods: {
      toggleMenu() {
        this.isClosed = !this.isClosed;
      },
      logout() {
        console.log('logging out');
        localStorage.removeItem('loggedIn');
        Router.push('/');
      }
    }
  }
</script>
<style>
  .collapsed {
    transition: opacity 1s;
  }
</style>
