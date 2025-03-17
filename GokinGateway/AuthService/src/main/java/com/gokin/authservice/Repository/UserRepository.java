package com.gokin.authservice.Repository;

import com.gokin.authservice.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
	Optional<User> findByUsername(String username);
	User findById(long id);
	boolean existsByUsername(String username);
	boolean existsByEmail(String email);
	boolean existsByEmailAndIdNot(String email, Long id);
	boolean existsByUsernameAndIdNot(String username, Long id);
}

