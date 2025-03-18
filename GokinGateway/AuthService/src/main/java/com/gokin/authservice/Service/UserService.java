package com.gokin.authservice.Service;

import com.gokin.authservice.DTO.SignUpResponse;
import com.gokin.authservice.Exceptions.EmailAlreadyExistsException;
import com.gokin.authservice.Exceptions.UsernameAlreadyExistsException;
import com.gokin.authservice.Model.Role;
import com.gokin.authservice.Model.User;
import com.gokin.authservice.Repository.UserRepository;
import com.google.common.collect.Lists;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@NoArgsConstructor
public class UserService {
	@Autowired
	UserRepository userRepository;
	public User save(User user) {
		return userRepository.save(user);
	}
	public User create(User user) {
		if (userRepository.existsByUsername(user.getUsername())) {
			throw new UsernameAlreadyExistsException("User with such username already exists");
		}
		
		if (userRepository.existsByEmail(user.getEmail())) {
			throw new EmailAlreadyExistsException("User with such email already exists");
		}
		
		return save(user);
	}

	public User getByUsername(String username) {
		return userRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));
		
	}
	public List<User> getUsers(){
		return Lists.newArrayList(userRepository.findAll());
	}

	public User GetUser(Long userId) {
		try {
			return userRepository.findById(userId).orElse(null);
		}
		catch (UsernameNotFoundException e) {
			throw new UsernameNotFoundException(e.getMessage());
		}

	}

	public User registerOAuthUser(OAuth2User user) {
		User newUser = new User();
		newUser.setEmail(user.getAttribute("email"));
		newUser.setUsername(user.getAttribute("name"));
		newUser.setPassword(null);
		newUser.setRole(Role.ROLE_USER);
		newUser.setAvatar(user.getAttribute("picture"));
		return userRepository.save(newUser);
	}

	
	/**
	 * Получение пользователя по имени пользователя
	 * <p>
	 * Нужен для Spring Security
	 *
	 * @return пользователь
	 */
	public UserDetailsService userDetailsService() {
		return this::getByUsername;
	}
	/**
	 * Получение текущего пользователя
	 *
	 * @return текущий пользователь
	 */
	public User getCurrentUser() {
		// Получение имени пользователя из контекста Spring Security
		var username = SecurityContextHolder.getContext().getAuthentication().getName();
		return getByUsername(username);
	}
	/**
	 * Выдача прав администратора текущему пользователю
	 * <p>
	 * Нужен для демонстрации
	 */
	@Deprecated
	public void getAdmin() {
		var user = getCurrentUser();
		user.setRole(Role.ROLE_ADMIN);
		save(user);
	}
	
}
