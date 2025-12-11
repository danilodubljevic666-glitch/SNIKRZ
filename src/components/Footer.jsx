// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Truck,
  Shield
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Logo i opis */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👟</span>
              </div>
              <h2 className="text-2xl font-bold">SNKRZ</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Najbolje patike na jednom mjestu. Originalni brendovi, najnoviji modeli i brza dostava u cijeloj Crnoj Gori.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Brzi linkovi */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Brzi linkovi</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition text-sm">
                  Svi proizvodi
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition text-sm">
                  O nama
                </Link>
              </li>
       
            </ul>
          </div>

          {/* Kontakt informacije */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Kontakt</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+382 06 048 655</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@snkrz.cg</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">Bulevar 13. jul, Nikšić</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Radno vreme</h4>
              <p className="text-gray-400 text-sm">Pon - Pet: 09:00 - 20:00</p>
              <p className="text-gray-400 text-sm">Subota: 10:00 - 16:00</p>
            </div>
          </div>

          {/* Sigurnost i plaćanje */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Sigurnost i plaćanje</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="text-green-400" size={20} />
                <div>
                  <p className="text-sm font-medium">Sigurna kupovina</p>
                  <p className="text-xs text-gray-400">SSL zaštićeno</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="text-blue-400" size={20} />
                <div>
                  <p className="text-sm font-medium">Plaćanje pouzećem</p>
                  <p className="text-xs text-gray-400">Prilikom preuzimanja</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="text-orange-400" size={20} />
                <div>
                  <p className="text-sm font-medium">Brza dostava</p>
                  <p className="text-xs text-gray-400">3-5 radnih dana</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="text-sm text-gray-400">
                Prihvatamo:
              </p>
              <div className="flex gap-2 mt-2">
                <div className="bg-gray-800 px-3 py-1 rounded text-xs">Pouzeće</div>
              </div>
            </div>
          </div>
        </div>

        {/* Donji deo footera */}
        <div className="border-t border-gray-800 mt-10 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} SNKRZ Shop. Sva prava zadržana.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">Politika privatnosti</a>
              <a href="#" className="hover:text-white transition">Reklamacije</a>
              <a href="#" className="hover:text-white transition">Povraćaj novca</a>
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-6">
            Svi proizvodi su originali sa garancijom autentičnosti.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;