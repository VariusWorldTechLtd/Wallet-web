<template>
  <div class="user">
    <div class="photo">
      <img src="/static/img/faces/face-2.jpg"/>
    </div>
    <div class="info">
      <a data-toggle="collapse" @click="toggleMenu" href="javascript:void(0)">
           <span name="walletAddress">
             {{ myWalletAddress }}
             <b class="caret"></b>
          </span>
      </a>
      <div class="clearfix"></div>
      <div>
        <el-collapse-transition>
          <ul class="nav" v-show="!isClosed">
            <!-- <li>
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
            </li> -->
            <li>
                <button @click="logout" name="logout" class="btn btn-primary sidebar-normal">Logout</button>
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
        isClosed: true,
        myWalletAddress: localStorage.getItem('myMobileWalletAddress')
      }
    },
    methods: {
      toggleMenu() {
        this.isClosed = !this.isClosed;
      },
      logout() {
        console.log('logging out');
        localStorage.clear();
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
