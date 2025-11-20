import { UserOnlineList, UserOnlineListTrigger } from "./templates/online-list";
import { rootRemoveLoading } from "../../libs/redux/reducers/root.slice";
import type { RootState } from "../../libs/redux/store";
import { useDispatch, useSelector } from "react-redux";
import UserSidebar from "./templates/sidebar";
import { addComma } from "../../libs/string";
import UserHeader from "./templates/header";
import Footer from "./templates/footer";
import { useEffect } from "react";
import "./user.styles.main.scss";
import $ from "jquery";

export interface UserGlobalStyleInterface {
  navbarHeight: number;
  sidebarWidth: number;
  primaryColor: string;
  secondaryColor: string;
}

const globalStyle: UserGlobalStyleInterface = {
  navbarHeight: 35,
  sidebarWidth: 220,
  primaryColor: "rgb(50, 101, 167)",
  secondaryColor: "rgb(33, 76, 131)",
};

function UserHome() {
  const data: any[] = [
    /* This will fetch from server */
  ];

  let totalProduk: number = 0;
  let totalBelanja: number = 0;

  return (
    <div className="Kasir">
      <h1 className="Judul">Mesin Kasir</h1>
      <div className="Keranjang">
        <div className="Judul-Produk">
          <p className="Nama">Nama</p>
          <p className="Jumlah-Pembelian">Jumlah</p>
          <p className="Harga">Harga</p>
        </div>
        <div className="Daftar-Produk">
          {data.map((d, dx) => {
            totalProduk++;
            totalBelanja += d.hargaJual * d.jumlahPembelian;
            return (
              <div key={dx} className="Produk">
                <p className="Nama">{d.nama}</p>
                <p className="Jumlah-Pembelian">
                  {addComma(d.jumlahPembelian)}
                </p>
                <p className="Harga">{addComma(d.hargaJual)}</p>
              </div>
            );
          })}
          {data.length < 1 && <p className="Kosong">Kosong</p>}
        </div>

        <input
          type="text"
          className="Pencarian"
          placeholder="Cari barang"
          style={{
            border: `1px solid ${globalStyle.secondaryColor}`,
            color: globalStyle.primaryColor,
          }}
        />

        <div className="Daftar-Tombol-Total">
          <button
            className="Bayar"
            style={{ backgroundColor: globalStyle.primaryColor }}
          >
            Bayar
          </button>
          <button
            className="Batal"
            style={{ backgroundColor: globalStyle.primaryColor }}
          >
            Batal
          </button>

          <h1 className="Total">Rp {addComma(totalBelanja)} -</h1>
        </div>
      </div>
    </div>
  );
}

function UserGlobalTemplates({ children, socketConnect }: any) {
  const onlineState = useSelector((state: RootState) => state.user_onlineList);
  const dispatch = useDispatch();

  function socketListener() {}

  // When the page is loaded or refreshed
  async function load() {
    socketListener();

    // After 3 seconds remove loading animation
    setTimeout(() => dispatch(rootRemoveLoading()), 3000);
  }

  useEffect(() => {
    // Force scrolll to top
    $("html, body").animate({ scrollTop: 0 }, "fast");

    // Connect to socket server, before any tasks
    socketConnect(load);
  }, []);

  return (
    <div
      className="User"
      style={{
        paddingTop: globalStyle.navbarHeight,
        paddingLeft: globalStyle.sidebarWidth,
      }}
    >
      <UserHeader globalStyle={globalStyle} />
      <UserSidebar globalStyle={globalStyle} />
      {onlineState.opened && <UserOnlineList globalStyle={globalStyle} />}
      <UserOnlineListTrigger />
      {children}
      <Footer globalStyle={globalStyle} />
    </div>
  );
}

const UserRoutes = [
  {
    path: "/user",
    element: (props: any) => {
      return (
        <UserGlobalTemplates {...props}>
          <UserHome />
        </UserGlobalTemplates>
      );
    },
  },
];

export default UserRoutes;
